// Old CommonJS syntax (Incorrect for ESM)
// const express = require('express');
// const bodyParser = require('body-parser');
// const { Configuration, OpenAIApi } = require('openai');
// require('dotenv').config();

// Correct ESM syntax
import express from 'express';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';

import { User } from './userDB.js';

import connect from './db.js';

dotenv.config();  // Initialize environment variables

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API,
});
connect()



app.post('/api/ask', async (req, res) => {
    const flaskUrl = 'https://7600-34-125-185-124.ngrok-free.app/generate';

    const { question, conversation } = req.body;

    try {
        // Build messages array using the conversation history first, filtering out null/empty content
        const messages = conversation
            .filter(message => message.content && message.content.trim() !== '')  // Exclude null or empty content
            .map((message) => ({
                role: message.role === 'bot' ? 'assistant' : message.role,  // Replace 'bot' with 'assistant'
                content: message.content
            }));

        // Add the new question to the messages array
        messages.push({
            role: 'user',
            content: question  // Add the current question as the latest message
        });
        let notes;

        if (model === 'fine-tuned') {
            // Use the fine-tuned GPT-2 model via Flask
            const flaskResponse = await axios.post(flaskUrl, {
                prompt: question,
                conversation: messages
            });
            notes = flaskResponse.data.generated_text;

        } else if (model === 'chatgpt') {
            // Use OpenAI's ChatGPT API
            const gptResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",  // Specify the OpenAI model you want to use
                messages: messages,
            });
            notes = gptResponse.choices[0].message.content;
        }

        res.json({ notes });

    } catch (error) {
        console.log('Error in /api/ask:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


app.post('/api/register', async(req, res)=>{
    const{username, password} = req.body;
    try{
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({error:'username exists'});
        }
        const user =  await User.create({username, password})
        

        res.status(201).json({message:"username registered"})
        
    }
    catch(error){
        console.error('Error:', error);
        res.status(500).json({error:error.message})
    }

})
app.post('/api/login', async(req, res)=>{
    const{username, password}= req.body;
    try{
        const user = User.findOne({username})
        if (!user){
            console.log('username not found')
        }
        if (password != user.password){
            console.log('password wrong', password)
            console.log(user.password)
        }
        res.status(200).json({message:'logged in successfully'})


    }catch(error){
        console.log('username not found')
    }
})



app.listen(5001, () => {
    console.log('Server running on port 5001');
});
