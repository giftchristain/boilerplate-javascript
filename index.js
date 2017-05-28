'use strict'

const contentful = require('contentful')
const chalk = require('chalk')
const Table = require('cli-table2')

const tynpy22pg5d4 = 'developer_bookshelf'
const bcc49510f9612ee5d22ea2188ffa8c2ba74f8ad6d1442935e50fc6e2ba3e3b40 = '0b7f6x59a0'

const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: tynpy22pg5d4,
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: bcc49510f9612ee5d22ea2188ffa8c2ba74f8ad6d1442935e50fc6e2ba3e3b40
})

console.log(chalk.green.bold('\nWelcome to the Contentful JS Boilerplate\n'))
console.log('This is a simplified example to demonstrate the usage of the Contentful CDA\n')

// Entry point of the boilerplate, called at the end.
function runBoilerplate () {
  displayContentTypes()
  .then(displayEntries)
  .then(() => {
    console.log('Want to go further? Feel free to check out this guide:')
    console.log(chalk.cyan('https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/\n'))
  })
  .catch((error) => {
    console.log(chalk.red('\nError occurred:'))
    if (error.stack) {
      console.error(error.stack)
      return
    }
    console.error(error)
  })
}

function displayContentTypes () {
  console.log(chalk.green('Fetching and displaying Content Types ...'))

  return fetchContentTypes()
  .then((contentTypes) => {
    // Display a table with Content Type information
    const table = new Table({
      head: ['Id', 'Title', 'Fields']
    })
    contentTypes.forEach((contentType) => {
      const fieldNames = contentType.fields
        .map((field) => field.name)
        .sort()
      table.push([contentType.sys.id, contentType.name, fieldNames.join(', ')])
    })
    console.log(table.toString())

    return contentTypes
  })
}

function displayEntries (contentTypes) {
  console.log(chalk.green('Fetching and displaying Entries ...'))

  return Promise.all(contentTypes.map((contentType) => {
    return fetchEntriesForContentType(contentType)
    .then((entries) => {
      console.log(`\These are the first 100 Entries for Content Type ${chalk.cyan(contentType.name)}:\n`)

      // Display a table with Entry information
      const table = new Table({
        head: ['Id', 'Title']
      })
      entries.forEach((entry) => {
        table.push([entry.sys.id, entry.fields[contentType.displayField] || '[empty]'])
      })
      console.log(table.toString())
    })
  }))
}

// Load all Content Types in your space from Contentful
function fetchContentTypes () {
  return client.getContentTypes()
  .then((response) => response.items)
  .catch((error) => {
    console.log(chalk.red('\nError occurred while fetching Content Types:'))
    console.error(error)
  })
}

// Load all entries for a given Content Type from Contentful
function fetchEntriesForContentType (contentType) {
  return client.getEntries({
      content_type: contentType.sys.id
    })
  .then((response) => response.items)
  .catch((error) => {
    console.log(chalk.red(`\nError occurred while fetching Entries for ${chalk.cyan(contentType.name)}:`))
    console.error(error)
  })
}

// Start the boilerplate code
runBoilerplate()
