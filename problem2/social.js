const express = require('express');
const app = express();
const port = 3000;

// Sample dataset (Replace with actual database connection if needed)
const posts = [
    { user: 'userA', postId: 101, comments: 14, timestamp: 1712001000 },
    { user: 'userB', postId: 102, comments: 7, timestamp: 1712102000 },
    { user: 'userA', postId: 103, comments: 9, timestamp: 1712203000 },
    { user: 'userC', postId: 104, comments: 18, timestamp: 1712304000 },
    { user: 'userB', postId: 105, comments: 13, timestamp: 1712405000 }
];

// API to get top users based on post count
app.get('/users', (req, res) => {
    const userPostFrequency = posts.reduce((acc, post) => {
        acc[post.user] = (acc[post.user] || 0) + 1;
        return acc;
    }, {});

    const sortedUsers = Object.entries(userPostFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([user, count]) => ({ user, count }));

    res.json(sortedUsers);
});

// API to fetch posts based on popularity or recency
app.get('/posts', (req, res) => {
    const filterType = req.query.type;
    let filteredPosts = [];

    if (filterType === 'popular') {
        filteredPosts = [...posts].sort((a, b) => b.comments - a.comments).slice(0, 5);
    } else if (filterType === 'latest') {
        filteredPosts = [...posts].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
    } else {
        return res.status(400).json({ error: 'Invalid type parameter. Use latest or popular.' });
    }

    res.json(filteredPosts);
});

app.listen(port, () => {
    console.log(`Server is live at http://localhost:${port}`);
});
