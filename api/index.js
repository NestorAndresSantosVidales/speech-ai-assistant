const express = require('express');
const multer = require('multer');
const axios = require('axios');
const { SpeechClient } = require('@google-cloud/speech');
const cors = require('cors');
require('dotenv').config()

const { Configuration, OpenAIApi } = require( "openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());

// Set up multer to handle file uploads
const upload = multer({
 storage: multer.memoryStorage()
});

// Handle POST requests to /api/v1/whisper/chat
app.post('/api/v1/whisper/chat', upload.single('audio'), async (req, res) => {
  console.log('Whisper version for the API')
  console.log(req.file); // logs information about the uploaded file

  try {
    // Send the audio file to the Whisper API for transcription
    const response = await axios.post('https://api.whisper.ai/v1/transcribe', {
      audio: {
        data: req.file.buffer.toString('base64'),
        contentType: 'audio/webm',
      },
      language: 'en-US',
    }, {
      headers: {
        Authorization: `Bearer ${process.env.WHISPER_API_KEY}`,
      },
    });

    console.log(response.data.transcription); // logs the transcription returned by the Whisper API

    res.sendStatus(200); // send a response indicating success
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // send a response indicating an error occurred
  }
});

// Initialize a new SpeechClient object
const speechClient = new SpeechClient();

// Handle POST requests to /api/v1/google/chat
app.post('/api/v1/google/chat', upload.single('audio'), async (req, res) => {
  console.log('Google version for the API')
  console.log(req.file); // logs information about the uploaded file
  console.log(req.file.buffer);
  
  try {
    // Send the audio file to the Google Cloud Speech-to-Text API for transcription
    const audio = {
      content: req.file.buffer
    };
    const config = {
      encoding: 'WEBM_OPUS',
      languageCode: 'es-CO',
    };
    const request = {
      audio: audio,
      config: config,
    };
  
      // Detects speech in the audio file
    const [response] = await speechClient.recognize(request);
    console.log(response);
    console.log(response.results[0].alternatives[0]);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    console.log(`Transcription: ${transcription}`);

    const responseOpenAI = await getResponse(transcription);
    
    res.status(200).send({
      question: transcription,
      answer: responseOpenAI
    }); // send a response indicating success
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // send a response indicating an error occurred
  }
});

async function getResponse(transcription) {
  console.log('Requesting the next question: ', transcription)

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{
      content: transcription,
      role: 'assistant'
    }]
  });
  
  return response.data.choices[0].message.content.trim();
}

// Start the server
app.listen(3005, () => {
  console.log('Server is running on port 3005');
});
