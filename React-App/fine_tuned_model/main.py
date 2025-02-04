import csv
import json
import torch
import pandas as pd
from transformers import GPT2Tokenizer, GPT2LMHeadModel, Trainer, TrainingArguments
from datasets import load_dataset

# Force CPU usage to avoid MPS issues
device = torch.device("cpu")
print(f"Using device: {device}")

# Replace with your CSV file path
csv_file_path = 'stud.csv'
jsonl_file_path = 'fine_tune_dataset.jsonl'

# Convert CSV to JSONL format
with open(csv_file_path, mode='r') as csv_file:
    csv_reader = csv.DictReader(csv_file)

    # Open JSONL file to write the prompt-completion pairs
    with open(jsonl_file_path, mode='w') as jsonl_file:
        for row in csv_reader:
            prompt = row['Prompt']  # Adjust column name based on your sheet
            completion = row['Notes']  # Adjust column name based on your sheet

            # Create prompt-completion pair as JSON object
            prompt_completion = {
                "prompt": prompt,
                "completion": completion
            }

            # Write the JSON object to the JSONL file
            jsonl_file.write(json.dumps(prompt_completion) + '\n')

print("CSV data successfully converted to JSONL format.")

# Load CSV file into pandas
df = pd.read_csv("stud.csv")

# Rename columns to match our format
df.columns = ["Prompt", "Notes"]

# Merge the prompt and completion into one string (for autoregressive models like GPT)
df["text"] = df["Prompt"] + " " + df["Notes"]

# Save as a new CSV or use it directly
df.to_csv("fine_tuning_data.csv", index=False)

# Load dataset from the CSV
dataset = load_dataset('csv', data_files='fine_tuning_data.csv')

# Preview the data
print(dataset['train'][0])

# Load the pre-trained GPT-2 tokenizer and model
model_name = "gpt2"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

# Add a pad token if it doesn't exist
tokenizer.pad_token = tokenizer.eos_token

# Move model to the CPU explicitly
model.to(device)

# Tokenization function with explicit device moving for input tensors
def tokenize_function(examples):
    # Tokenize and add the label (completion) to the inputs
    tokenized_inputs = tokenizer(examples["text"], truncation=True, padding="max_length", max_length=512)
    tokenized_inputs["labels"] = tokenized_inputs["input_ids"].copy()  # For causal language models
    
    # Convert to tensor and explicitly move to the CPU
    tokenized_inputs = {key: torch.tensor(val).to(device) for key, val in tokenized_inputs.items()}
    
    return tokenized_inputs

# Tokenize the dataset with added labels
tokenized_datasets = dataset.map(tokenize_function, batched=True, remove_columns=["text"])

# Load tokenized data for training
tokenized_datasets.set_format("torch", columns=["input_ids", "attention_mask", "labels"])

# Split dataset into training and validation sets (Optional but recommended)
train_size = int(0.9 * len(tokenized_datasets['train']))
train_dataset = tokenized_datasets['train'].select(range(train_size))
val_dataset = tokenized_datasets['train'].select(range(train_size, len(tokenized_datasets['train'])))

# Move datasets to the CPU explicitly
train_dataset.set_format(type='torch', device=device)
val_dataset.set_format(type='torch', device=device)

# Define training arguments
training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",  # Updated key
    learning_rate=2e-5,
    per_device_train_batch_size=4,
    per_device_eval_batch_size=4,
    num_train_epochs=3,
    weight_decay=0.01,
    logging_dir="./logs",
)

# Custom training loop to explicitly move inputs to the correct device
def custom_train(trainer, model, train_dataset, val_dataset, training_args):
    # Use the Hugging Face Trainer for easier management
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
    )
    
    # Begin training
    trainer.train()

# Start training with custom loop to ensure inputs are on the same device
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
)

# Start training
trainer.train()

# Save the fine-tuned model and tokenizer
model.save_pretrained("./fine_tuned_model")
tokenizer.save_pretrained("./fine_tuned_model")

print("Fine-tuning completed and model saved.")

