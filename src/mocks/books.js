export const createBooks = ({ quantity = 1, shelf = 'wantToRead' }) => (
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

export const createBook = ({
  id = 'book-id-1',
  title = 'title-1',
  authors = ['author-1'],
  imageLinks = {
    thumbnail: 'thumbnail_1.jpg',
  },
  shelf = 'wantToRead',
}) => ({
  id,
  title,
  authors,
  imageLinks,
  shelf,
});

export default createBooks;
