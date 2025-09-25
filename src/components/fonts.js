import { Poppins, DM_Serif_Display } from "next/font/google";

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'], 
  style: ['normal', 'italic'], 
  display: 'swap',              
});

export const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],  
  style: ['normal'],
  display: 'swap',
});
