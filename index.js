import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Data Center
let posts = [
    { id: 1, content: 'Thus says the LORD, your Redeemer, The Holy One of Israel: "I am the LORD your God, Who teaches you to profit, Who leads you by the way you should go." - Is 48:17', timestamp: new Date()},
    { id: 2, content: 'Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)}, // 6 hours earlier
    { id: 3, content: '"Whatever your hand finds to do, do it with all your might,for in the realm of the dead, where you are going, there is neither working nor planning nor knowledge nor wisdom." - Ecc 9:10', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)}, // 1 day earlier
    { id: 4, content: 'Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. - Albert Schweitzer'},
    { id: 5, content: '"For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope." - Jer 29:11'},
];

let favoritePosts = [];
let deletedPosts = [];

// Home
app.get('/', (req, res) => {
    res.render('index.ejs', { posts: posts, favoritePosts: favoritePosts, isHomePage: true, favorites: false, deleted: false });
});

// Add a new post
app.post('/submit', (req, res) => {
    const newPost = {
        id: posts.length + 1,
        content: req.body.userPost,
        timestamp: new Date() //Add timestamp
    };
    posts.unshift(newPost); // Add the new post to the beginning of the array
    res.redirect('/');
});

// Like a post
app.post('/like/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    if (!favoritePosts.includes(postId)) {
        favoritePosts.push(postId);
    }
    res.json({ success: true });
});

// Unlike a post
app.post('/unlike/:id', (req,res) => {
    const postId = parseInt(req.params.id);
    favoritePosts = favoritePosts.filter(id => id !== postId);
    res.json({ success: true });
});

// Delete a post
app.post('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    if (post) {
        deletedPosts.push(post);
        posts = posts.filter(p => p.id !== postId);
    }
    res.redirect('/');
});

// View favorite posts
app.get('/favorites', (req, res) => {
    const favoritePostObjects = posts.filter(post => favoritePosts.includes(post.id));
    res.render('index.ejs', { posts: favoritePostObjects, favoritePosts: favoritePosts, isHomePage: false, favorites: true, deleted: false });
});

// View deleted posts
app.get('/deleted', (req, res) => {
    res.render('index.ejs', { posts: deletedPosts, favoritePosts: favoritePosts, isHomePage: false, favorites: false, deleted: true });
});

// Render the edit form
app.get('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    if (post) {
        res.render('edit.ejs', { post: post });
    } else {
        res.redirect('/');
    }
});

// Handle edit form submission
app.post('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const newContent = req.body.content;
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.content = newContent;
    }
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`Feeling down? Come to port ${port} and stay motivated!`);
});