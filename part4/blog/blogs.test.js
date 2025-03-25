const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('./utils/list_helper')
const bcrypt = require('bcrypt')
const User = require('./models/user')

// test('dummy returns one', () => {
//     const blogs = []

//     const result = listHelper.dummy(blogs)
//     assert.strictEqual(result, 1)
// })

// describe('total likes', () => {
//     const listWithOneBlog = [
//         {
//             _id: '5a422aa71b54a676234d17f8',
//             title: 'Go To Statement Considered Harmful',
//             author: 'Edsger W. Dijkstra',
//             url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//             likes: 5,
//             __v: 0
//         }
//     ]

//     const listWithMultipleBlogs = [
//         {
//             _id: '5a422aa71b54a676234d17f8',
//             title: 'Go To Statement Considered Harmful',
//             author: 'Edsger W. Dijkstra',
//             url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
//             likes: 5,
//             __v: 0
//         },
//         {
//             _id: '5a422aa71b54a676234d17f9',
//             title: 'Another Blog Post',
//             author: 'John Doe',
//             url: 'https://example.com/another',
//             likes: 10,
//             __v: 0
//         },
//         {
//             _id: '5a422aa71b54a676234d17fa',
//             title: 'Yet Another Blog Post',
//             author: 'Jane Doe',
//             url: 'https://example.com/yet-another',
//             likes: 0,
//             __v: 0
//         }
//     ];

//     test('when list has only one blog, equals the likes of that', () => {
//         const result = listHelper.totalLikes(listWithOneBlog)
//         assert.strictEqual(result, 5)
//     })

//     test('when list has multiple blogs, returns the sum of likes', () => {
//         const result = listHelper.totalLikes(listWithMultipleBlogs)
//         assert.strictEqual(result, 15)
//     })

//     test('when list is empty, returns zero', () => {
//         const result = listHelper.totalLikes([])
//         assert.strictEqual(result, 0)
//     })
// })

// describe('favorite blog', () => {
//     const blogs = [
//         {
//             title: 'First Blog',
//             author: 'Alice',
//             likes: 10
//         },
//         {
//             title: 'Second Blog',
//             author: 'Bob',
//             likes: 20
//         },
//         {
//             title: 'Third Blog',
//             author: 'Alice',
//             likes: 5
//         }
//     ];

//     test('returns the blog with the most likes', () => {
//         const result = listHelper.favoriteBlog(blogs);
//         const expected = {
//             title: 'Second Blog',
//             author: 'Bob',
//             likes: 20
//         };
//         assert.deepStrictEqual(result, expected);
//     });

//     test('returns null for an empty list', () => {
//         const result = listHelper.favoriteBlog([]);
//         assert.strictEqual(result, null);
//     });
// });

// describe('most likes', () => {
//     const blogs = [
//         {
//             author: 'Edsger W. Dijkstra',
//             title: 'Go To Statement Considered Harmful',
//             likes: 5
//         },
//         {
//             author: 'Robert C. Martin',
//             title: 'Clean Code',
//             likes: 10
//         },
//         {
//             author: 'Edsger W. Dijkstra',
//             title: 'Structured Programming',
//             likes: 12
//         },
//         {
//             author: 'Alice',
//             title: 'Simple Post',
//             likes: 1
//         }
//     ];

//     test('returns the author with the most likes', () => {
//         const result = listHelper.mostLikes(blogs);
//         const expected = {
//             author: 'Edsger W. Dijkstra',
//             likes: 17
//         };
//         assert.deepStrictEqual(result, expected);
//     });

//     test('returns null for an empty list', () => {
//         const result = listHelper.mostLikes([]);
//         assert.strictEqual(result, null);
//     });
// });



describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })
})