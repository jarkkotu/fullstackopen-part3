const mongoose = require('mongoose')

if (process.argv.length != 3 && process.argv.length != 5) {
  console.log('Usage:')
  console.log('Read all: node mongo.js <password>')
  console.log('Write: node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]
const uri = `mongodb+srv://jarkkotuikka:${password}@cluster0.ldsr5.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(uri)
  .then(result => {
    // console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
    process.exit(0)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
  // console.log('Reading from database...')

  Person.find({}).then(persons => {
    console.log('phobebook:')
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
else if (process.argv.length == 5) {
  // console.log('Writing to database...')

  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
else {
  console.log('This should not happen')
  process.exit(1)
}