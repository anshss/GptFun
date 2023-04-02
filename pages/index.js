import { useState } from 'react'
import styles from '../styles/Home.module.scss'
import { Configuration, OpenAIApi } from 'openai'
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';

export default function Home() {

	const [transcription, setTranscription] = useState('');
	const [gptRes, setGptRes] = useState('');


	const configuration = new Configuration({
		apiKey: process.env.NEXT_PUBLIC_GPT_API_KEY,
	});

	const openai = new OpenAIApi(configuration);

	async function callGpt(prompt) {
		const model = "text-davinci-002";

		const response = await openai.createCompletion({
			model: model,
			prompt: prompt,
			temperature: 0.5,
			max_tokens: 60,
			stop: null,
		})
		setGptRes(response.data.choices[0].text.trim())
		synthesis(response.data.choices[0].text.trim())
	}

	function synthesis(prompt) {
		const utterance = new SpeechSynthesisUtterance(prompt)
		speechSynthesis.speak(utterance)
	}


	function recognize() {
		if (typeof (window) != undefined) {
			const recognition = new webkitSpeechRecognition();
			recognition.lang = 'en-US';

			recognition.onresult = (event) => {
				const result = event.results[0][0].transcript;
				setTranscription(result);
				callGpt(result)
			};

			recognition.start();
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2>AI to cover your problems. Say whatever you want !</h2>
			</div>

			<div className={styles.card}>
				<p>Start speaking by clicking on <KeyboardVoiceOutlinedIcon style={{ verticalAlign: 'top' }} fontSize='large' onClick={recognize} /></p>
				<div>
					{ transcription == '' ? <p>  Input </p> : <p> {transcription} </p> }
					{ gptRes == '' ? <p> Response </p> :  <p> {gptRes} </p>}
				</div>
			</div>

			<p className={styles.switch}>Switch to desktop</p>

		</div >
	)
}