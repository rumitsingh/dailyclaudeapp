// 18 recipes with ingredient lists for offline matching
export const recipes = [
  {
    id: 'r1',
    name: 'Spaghetti Aglio e Olio',
    description: 'Classic Italian pasta with garlic, olive oil, and chilli flakes.',
    time: '20 min',
    ingredients: ['spaghetti', 'garlic', 'olive oil', 'chilli flakes', 'parsley', 'parmesan'],
  },
  {
    id: 'r2',
    name: 'Egg Fried Rice',
    description: 'Quick leftover rice tossed with eggs, soy sauce, and spring onions.',
    time: '15 min',
    ingredients: ['rice', 'eggs', 'soy sauce', 'spring onions', 'garlic', 'sesame oil', 'peas'],
  },
  {
    id: 'r3',
    name: 'Tomato & Basil Omelette',
    description: 'Fluffy omelette filled with fresh tomatoes and basil.',
    time: '10 min',
    ingredients: ['eggs', 'tomatoes', 'basil', 'olive oil', 'salt', 'pepper'],
  },
  {
    id: 'r4',
    name: 'Chicken Stir-Fry',
    description: 'Tender chicken with vegetables in a savoury stir-fry sauce.',
    time: '25 min',
    ingredients: ['chicken breast', 'broccoli', 'bell pepper', 'soy sauce', 'garlic', 'ginger', 'sesame oil', 'onion'],
  },
  {
    id: 'r5',
    name: 'Avocado Toast',
    description: 'Creamy avocado on toasted bread with lemon and chilli.',
    time: '8 min',
    ingredients: ['bread', 'avocado', 'lemon', 'chilli flakes', 'salt', 'olive oil'],
  },
  {
    id: 'r6',
    name: 'Lentil Soup',
    description: 'Hearty red lentil soup with cumin and a squeeze of lemon.',
    time: '30 min',
    ingredients: ['red lentils', 'onion', 'garlic', 'tomatoes', 'cumin', 'olive oil', 'lemon', 'vegetable stock'],
  },
  {
    id: 'r7',
    name: 'Greek Salad',
    description: 'Crisp cucumbers, tomatoes, olives, and feta in olive oil.',
    time: '10 min',
    ingredients: ['cucumber', 'tomatoes', 'feta', 'olives', 'red onion', 'olive oil', 'oregano'],
  },
  {
    id: 'r8',
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with eggs, parmesan, and crispy bacon.',
    time: '20 min',
    ingredients: ['spaghetti', 'eggs', 'parmesan', 'bacon', 'garlic', 'black pepper'],
  },
  {
    id: 'r9',
    name: 'Vegetable Curry',
    description: 'Rich coconut vegetable curry served with rice.',
    time: '35 min',
    ingredients: ['potatoes', 'peas', 'tomatoes', 'onion', 'garlic', 'ginger', 'curry powder', 'coconut milk', 'rice'],
  },
  {
    id: 'r10',
    name: 'Mushroom Risotto',
    description: 'Creamy Arborio rice with sautéed mushrooms and parmesan.',
    time: '40 min',
    ingredients: ['arborio rice', 'mushrooms', 'onion', 'garlic', 'white wine', 'vegetable stock', 'parmesan', 'butter'],
  },
  {
    id: 'r11',
    name: 'Bean & Cheese Quesadillas',
    description: 'Crispy tortillas filled with black beans and melted cheese.',
    time: '15 min',
    ingredients: ['tortillas', 'black beans', 'cheddar cheese', 'onion', 'bell pepper', 'sour cream'],
  },
  {
    id: 'r12',
    name: 'Salmon & Veg Tray Bake',
    description: 'Oven-roasted salmon fillets with seasonal vegetables.',
    time: '30 min',
    ingredients: ['salmon', 'broccoli', 'cherry tomatoes', 'lemon', 'olive oil', 'garlic', 'paprika'],
  },
  {
    id: 'r13',
    name: 'Pesto Pasta',
    description: 'Pasta tossed with basil pesto and topped with pine nuts.',
    time: '15 min',
    ingredients: ['pasta', 'basil', 'parmesan', 'pine nuts', 'garlic', 'olive oil'],
  },
  {
    id: 'r14',
    name: 'Scrambled Eggs on Toast',
    description: 'Soft, buttery scrambled eggs on thick sourdough.',
    time: '8 min',
    ingredients: ['eggs', 'butter', 'bread', 'salt', 'pepper', 'chives'],
  },
  {
    id: 'r15',
    name: 'Chickpea Salad',
    description: 'Protein-packed salad with chickpeas, cucumber, and tahini dressing.',
    time: '10 min',
    ingredients: ['chickpeas', 'cucumber', 'tomatoes', 'red onion', 'tahini', 'lemon', 'parsley'],
  },
  {
    id: 'r16',
    name: 'Spicy Noodle Bowl',
    description: 'Noodles in a spicy sesame broth with soft-boiled egg and veg.',
    time: '25 min',
    ingredients: ['noodles', 'eggs', 'soy sauce', 'sesame oil', 'chilli paste', 'spring onions', 'bok choy', 'ginger'],
  },
  {
    id: 'r17',
    name: 'Banana Oat Pancakes',
    description: 'Fluffy two-ingredient pancakes with banana and oats.',
    time: '15 min',
    ingredients: ['banana', 'oats', 'eggs', 'honey', 'cinnamon'],
  },
  {
    id: 'r18',
    name: 'Tomato Basil Bruschetta',
    description: 'Grilled bread topped with fresh tomatoes, basil, and balsamic.',
    time: '12 min',
    ingredients: ['bread', 'tomatoes', 'basil', 'garlic', 'olive oil', 'balsamic vinegar'],
  },
]

/**
 * Score and return top-N recipes based on fridge items the user has.
 * @param {string[]} fridgeItems - lowercase ingredient names the user has
 * @param {number} topN - how many to return
 */
export function matchRecipes(fridgeItems, topN = 3) {
  const normalised = fridgeItems.map(i => i.toLowerCase().trim())

  const scored = recipes.map(recipe => {
    const matched = recipe.ingredients.filter(ing =>
      normalised.some(fi => fi.includes(ing) || ing.includes(fi))
    )
    const score = matched.length / recipe.ingredients.length
    return { ...recipe, matched, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
}
