import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Mail, CheckCircle2, AlertCircle, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function EmailSetupGuide() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const gmailSteps = [
    {
      title: "Enable 2-Step Verification",
      description: "Go to your Google Account and enable 2-Step Verification",
      link: "https://myaccount.google.com/security"
    },
    {
      title: "Create App Password",
      description: "Generate a 16-character app password for email",
      link: "https://myaccount.google.com/apppasswords"
    },
    {
      title: "Copy Configuration",
      description: "Use these settings in your Supabase environment variables",
      config: {
        SMTP_HOST: "smtp.gmail.com",
        SMTP_PORT: "587",
        SMTP_USER: "your-email@gmail.com",
        SMTP_PASS: "your-16-char-app-password",
        SMTP_FROM_EMAIL: "your-email@gmail.com",
        SMTP_FROM_NAME: "Hotel Booking System"
      }
    }
  ];

  const outlookSteps = [
    {
      title: "Use Your Outlook Account",
      description: "You can use your regular Outlook/Hotmail password",
      link: "https://outlook.live.com"
    },
    {
      title: "Copy Configuration",
      description: "Use these settings in your Supabase environment variables",
      config: {
        SMTP_HOST: "smtp-mail.outlook.com",
        SMTP_PORT: "587",
        SMTP_USER: "your-email@outlook.com",
        SMTP_PASS: "your-regular-password",
        SMTP_FROM_EMAIL: "your-email@outlook.com",
        SMTP_FROM_NAME: "Hotel Booking System"
      }
    }
  ];

  const sendgridSteps = [
    {
      title: "Sign Up for SendGrid",
      description: "Free tier includes 100 emails per day",
      link: "https://sendgrid.com/free"
    },
    {
      title: "Create API Key",
      description: "Go to Settings > API Keys and create a new key with Full Access",
      link: "https://app.sendgrid.com/settings/api_keys"
    },
    {
      title: "Copy Configuration",
      description: "Use these settings in your Supabase environment variables",
      config: {
        SMTP_HOST: "smtp.sendgrid.net",
        SMTP_PORT: "587",
        SMTP_USER: "apikey",
        SMTP_PASS: "your-sendgrid-api-key",
        SMTP_FROM_EMAIL: "your-verified-email@yourdomain.com",
        SMTP_FROM_NAME: "Hotel Booking System"
      }
    }
  ];

  const ConfigCard = ({ config, startIndex }: { config: any; startIndex: number }) => (
    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mt-3">
      {Object.entries(config).map(([key, value], idx) => (
        <div key={key} className="flex items-center justify-between mb-2 last:mb-0">
          <span>
            <span className="text-blue-400">{key}</span>=<span className="text-yellow-300">{value as string}</span>
          </span>
          <button
            onClick={() => copyToClipboard(`${key}=${value}`, startIndex + idx)}
            className="ml-4 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-white flex items-center gap-1"
          >
            {copiedIndex === startIndex + idx ? (
              <>
                <CheckCircle2 size={12} /> Copied
              </>
            ) : (
              <>
                <Copy size={12} /> Copy
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-900 rounded-full mb-4">
              <Mail className="text-white" size={32} />
            </div>
            <h1 className="text-4xl mb-4">Email Setup Guide</h1>
            <p className="text-xl text-gray-600">
              Configure SMTP to send booking confirmations to ANY customer email
            </p>
          </div>

          {/* Why SMTP */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <h3 className="flex items-center gap-2 mb-3">
                <AlertCircle className="text-blue-600" size={20} />
                Why SMTP Instead of Resend?
              </h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <strong>Resend Limitation:</strong> Free tier only allows sending emails to verified addresses. 
                  To send to ANY customer email, you need to verify a domain (requires DNS setup).
                </p>
                <p>
                  <strong>SMTP Solution:</strong> Using SMTP with Gmail, Outlook, or SendGrid allows you to send 
                  confirmation emails to ANY customer email address without domain verification!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Gmail Setup */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Mail className="text-red-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl">Option 1: Gmail (Recommended)</h2>
                  <p className="text-sm text-gray-600">Free, easy to set up, reliable</p>
                </div>
              </div>

              <div className="space-y-4">
                {gmailSteps.map((step, idx) => (
                  <div key={idx} className="border-l-4 border-red-500 pl-4">
                    <h3 className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">
                        {idx + 1}
                      </span>
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                    {step.link && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(step.link, '_blank')}
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Open Link
                      </Button>
                    )}
                    {step.config && <ConfigCard config={step.config} startIndex={idx * 10} />}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Important for Gmail:</strong> You MUST use an App Password, not your regular Gmail password. 
                  Regular passwords won't work with SMTP.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Outlook Setup */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl">Option 2: Outlook/Hotmail</h2>
                  <p className="text-sm text-gray-600">Simple setup with regular password</p>
                </div>
              </div>

              <div className="space-y-4">
                {outlookSteps.map((step, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                        {idx + 1}
                      </span>
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                    {step.link && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(step.link, '_blank')}
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Open Link
                      </Button>
                    )}
                    {step.config && <ConfigCard config={step.config} startIndex={100 + idx * 10} />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SendGrid Setup */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail className="text-green-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl">Option 3: SendGrid</h2>
                  <p className="text-sm text-gray-600">Professional service, 100 emails/day free</p>
                </div>
              </div>

              <div className="space-y-4">
                {sendgridSteps.map((step, idx) => (
                  <div key={idx} className="border-l-4 border-green-500 pl-4">
                    <h3 className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
                        {idx + 1}
                      </span>
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                    {step.link && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(step.link, '_blank')}
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Open Link
                      </Button>
                    )}
                    {step.config && <ConfigCard config={step.config} startIndex={200 + idx * 10} />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How to Add to Supabase */}
          <Card className="mb-6 border-purple-200 bg-purple-50">
            <CardContent className="p-6">
              <h3 className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-purple-600" size={20} />
                How to Add Environment Variables to Supabase
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Go to your Supabase Dashboard</li>
                <li>Navigate to: Project Settings → Edge Functions</li>
                <li>Scroll to "Environment Variables" section</li>
                <li>Click "Add Variable" for each SMTP setting</li>
                <li>Copy-paste the Name and Value from the configuration above</li>
                <li>Click "Save" after adding all variables</li>
                <li>Redeploy your Edge Functions (automatic in most cases)</li>
              </ol>
              
              <div className="mt-4 p-3 bg-white rounded border border-purple-200">
                <p className="text-sm">
                  <strong>Note:</strong> After adding the variables, test by making a booking. 
                  Check the Edge Function logs to see if emails are being sent successfully.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Testing */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <h3 className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="text-green-600" size={20} />
                Testing Your Email Configuration
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Add all SMTP environment variables to Supabase</li>
                <li>Wait 1-2 minutes for the variables to be applied</li>
                <li>Make a test booking on your website</li>
                <li>Check the customer's email inbox (and spam folder)</li>
                <li>Check Supabase Edge Function logs for any errors</li>
              </ol>
              
              <div className="mt-4 p-3 bg-white rounded border border-green-200">
                <p className="text-sm">
                  <strong>Success:</strong> You'll see a beautifully formatted booking confirmation email 
                  with all booking details, billing summary, and hotel information!
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
}
