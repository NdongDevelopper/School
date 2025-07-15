// app/support/page.tsx
"use client"; // Indique que ce composant est un Client Component

import { useState } from 'react';
import Link from 'next/link';

export default function SupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setResponseMessage('');

    // Ici, dans un vrai projet, vous enverriez ces données à une API backend.
    // Par exemple, une Server Action Next.js, une API Route, ou un service tiers.
    // Pour cet exemple, nous allons simuler un envoi réussi ou échoué.

    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simuler une réussite
      setStatus('success');
      setResponseMessage('Votre message a été envoyé avec succès ! Nous vous recontacterons bientôt.');
      setName('');
      setEmail('');
      setMessage('');

      // Simuler une erreur (décommentez pour tester l'erreur)
      // throw new Error("Erreur lors de l'envoi du message.");

    } catch (error) {
      setStatus('error');
      setResponseMessage("Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.");
      console.error("Erreur d'envoi du formulaire de contact :", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
          Contactez le Support
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Vous avez une question ou rencontrez un problème ? N'hésitez pas à nous envoyer un message.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse e-mail
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Votre message
            </label>
            <textarea
              id="message"
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base resize-y"
            ></textarea>
          </div>

          {status === 'loading' && (
            <p className="text-center text-blue-600">Envoi en cours...</p>
          )}
          {status === 'success' && (
            <p className="text-center text-green-600 font-medium">{responseMessage}</p>
          )}
          {status === 'error' && (
            <p className="text-center text-red-600 font-medium">{responseMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
              status === 'loading'
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            Envoyer le message
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            Retour à la page de connexion
          </Link>
        </div>
      </div>
    </div>
  );
}