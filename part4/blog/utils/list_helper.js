const User = require('../models/user')

const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;

    const favorite = blogs.reduce((prev, current) => (current.likes > prev.likes ? current : prev));
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    };
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null;

    const authorCount = blogs.reduce((count, blog) => {
        count[blog.author] = (count[blog.author] || 0) + 1;
        return count;
    }, {});

    const topAuthor = Object.keys(authorCount).reduce((top, author) =>
        authorCount[author] > authorCount[top] ? author : top
    );

    return {
        author: topAuthor,
        blogs: authorCount[topAuthor]
    };
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;

    const likesCount = blogs.reduce((count, blog) => {
        count[blog.author] = (count[blog.author] || 0) + blog.likes;
        return count;
    }, {});

    const topAuthor = Object.keys(likesCount).reduce((top, author) =>
        likesCount[author] > likesCount[top] ? author : top
    );

    return {
        author: topAuthor,
        likes: likesCount[topAuthor]
    };
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    usersInDb,
}