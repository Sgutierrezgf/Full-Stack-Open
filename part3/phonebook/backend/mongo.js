const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]

const url =
    `mongodb+srv://fullstack:${password}@cluster0.lnsib.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    phone: Number,
})

const PhoneBook = mongoose.model('Phonebook', phonebookSchema)

const phonebook = new PhoneBook({
    name: name,
    phone: phone,
})

// phonebook.save().then(result => {
//     console.log('phone saved!')
//     mongoose.connection.close()
// })

PhoneBook.find({}).then(result => {
    result.forEach(phonebook => {
        console.log(phonebook)
    })
    mongoose.connection.close()
})