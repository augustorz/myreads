export default ({ quantity = 1, shelf = 'wantToRead' }) => (
  Array.from(Array(quantity), (value, index) => ({
    id: `book-${index}`,
    title: `Author Mock ${index}`,
    authors: [`Title Mock ${index}`],
    imageLinks: {
      thumbnail: `thumbnail_${index}.png`,
    },
    shelf,
  }))
);
