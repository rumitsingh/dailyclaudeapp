// 60 curated daily quotes — picked by seeding on calendar date
export const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "An unexamined life is not worth living.", author: "Socrates" },
  { text: "Spread love everywhere you go.", author: "Mother Teresa" },
  { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
  { text: "Always remember that you are absolutely unique. Just like everyone else.", author: "Margaret Mead" },
  { text: "Don't go around saying the world owes you a living.", author: "Mark Twain" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { text: "You can never cross the ocean until you have the courage to lose sight of the shore.", author: "Christopher Columbus" },
  { text: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.", author: "Maya Angelou" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "In this life we cannot do great things. We can only do small things with great love.", author: "Mother Teresa" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { text: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
  { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" },
  { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
  { text: "Many of life's failures are people who did not realize how close they were to success when they gave up.", author: "Thomas Edison" },
  { text: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.", author: "Dr. Seuss" },
  { text: "If life were predictable it would cease to be life, and be without flavor.", author: "Eleanor Roosevelt" },
  { text: "If you look at what you have in life, you'll always have more.", author: "Oprah Winfrey" },
  { text: "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.", author: "James Cameron" },
  { text: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", author: "Maya Angelou" },
  { text: "If you want to live a happy life, tie it to a goal, not to people or things.", author: "Albert Einstein" },
  { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" },
  { text: "Money and success don't change people; they merely amplify what is already there.", author: "Will Smith" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Not how long, but how well you have lived is the main thing.", author: "Seneca" },
  { text: "If life were predictable it would cease to be life, and be without flavor.", author: "Eleanor Roosevelt" },
  { text: "The whole secret of a successful life is to find out what is one's destiny to do, and then do it.", author: "Henry Ford" },
  { text: "In order to write about life first you must live it.", author: "Ernest Hemingway" },
  { text: "The big lesson in life, baby, is never be scared of anyone or anything.", author: "Frank Sinatra" },
  { text: "Sing like no one's listening, love like you've never been hurt, dance like nobody's watching.", author: "Attributed to various" },
  { text: "Curiosity about life in all of its aspects, I think, is still the secret of great creative people.", author: "Leo Burnett" },
  { text: "Life is not a problem to be solved, but a reality to be experienced.", author: "Søren Kierkegaard" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "The way I see it, if you want the rainbow, you gotta put up with the rain.", author: "Dolly Parton" },
  { text: "Do all the good you can, for all the people you can, in all the ways you can, as long as you can.", author: "Hillary Clinton" },
  { text: "Don't settle for what life gives you; make life better and build something.", author: "Ashton Kutcher" },
  { text: "Everybody wants to be famous, but nobody wants to do the work.", author: "Kevin Hart" },
  { text: "I only have two rules for my newly born daughter: she will dress well and never cry on Sundays.", author: "Karl Lagerfeld" },
  { text: "You may not control all the events that happen to you, but you can decide not to be reduced by them.", author: "Maya Angelou" },
  { text: "Take the first step in faith. You don't have to see the whole staircase. Just take the first step.", author: "Martin Luther King Jr." },
  { text: "Determine never to be idle. No person will have occasion to complain of the want of time who never loses any.", author: "Thomas Jefferson" },
  { text: "If you're offered a seat on a rocket ship, don't ask what seat! Just get on.", author: "Sheryl Sandberg" },
  { text: "A surplus of effort could overcome a deficit of confidence.", author: "Sonia Sotomayor" },
  { text: "When you know better you do better.", author: "Maya Angelou" },
  { text: "Real change, enduring change, happens one step at a time.", author: "Ruth Bader Ginsburg" },
]

/**
 * Returns a deterministic quote for the given date string (YYYY-MM-DD).
 * Same date always returns the same quote.
 */
export function getDailyQuote(dateStr = new Date().toISOString().slice(0, 10)) {
  // Simple hash from date string
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) & 0xffffffff
  }
  const idx = Math.abs(hash) % quotes.length
  return quotes[idx]
}
