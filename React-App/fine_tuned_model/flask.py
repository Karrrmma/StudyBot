

# Add your ngrok authtoken here (replace with your actual token)
from flask import Flask, request, jsonify
from transformers import GPT2Tokenizer, GPT2LMHeadModel
import torch
from pyngrok import ngrok
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Add your ngrok authtoken here
ngrok.set_auth_token("2n5SpP4SVnqGCxlpEMlFJFkN3zw_4HyVLNch9Hs46SNggeSn5")

# Expose the Flask server running on port 4000
public_url = ngrok.connect(4000, bind_tls=True)  # Pass the port as an integer and bind TLS
print(f"Public URL: {public_url}")

# Load the fine-tuned model and tokenizer
model = GPT2LMHeadModel.from_pretrained("./fine_tuned_model")
tokenizer = GPT2Tokenizer.from_pretrained("./fine_tuned_model")

@app.route("/generate", methods=["POST"])
def generate_text():
    data = request.get_json()
    prompt = data.get("prompt", "")

    # Tokenize the input prompt
    input_ids = tokenizer.encode(prompt, return_tensors="pt")

    # Generate text with additional parameters
    output = model.generate(
        input_ids,
        max_length=50,
        num_return_sequences=1,
        temperature=0.7,  # Control randomness
        top_k=50,         # Limit the next token selection to top 50 tokens
        top_p=0.9         # Nucleus sampling for cumulative probability of 0.9
    )

    response = tokenizer.decode(output[0], skip_special_tokens=True)

    return jsonify({"generated_text": response})

if __name__ == "__main__":
    # Run Flask on port 4000
    app.run(host="0.0.0.0", port=4000, threaded=True)


