// Fonts
import { Open_Sans } from 'next/font/google'

// SASS
import './styles.scss'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const metadata = {
  title: "Turnero Innova",
  description: "Turnero Innova",
}
const openSans = Open_Sans({ weight: ['400'], subsets: ['cyrillic']})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description}/>
        <link rel="icon" href={metadata.icon}/>
      </head>
      <body className={openSans.className}>
        {children}
      </body>
    </html>
  )
}
