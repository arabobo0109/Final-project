import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import NewComment from "./NewComment";
import { useContext} from "react";
import { BooksContext } from "./BooksContext";

const BookDetails = () => {

  const [book, setBook] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const { isAuthenticated} = useAuth0();
  // console.log(user)
  const [commentPosted, setCommentPosted] = useState(false)

  const { bookId } = useParams();
  // console.log(bookId)

  const navigate = useNavigate();

  const { addToFavoriteHandler } = useContext(BooksContext);

  const handleClick = () => {
    // console.log("hi")
    window.open(book.previewLink);
  };

  //fetch data to have book details
  useEffect(() => {
    fetch(`/api/get-book/${bookId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setBook(data.data);
          // console.log(data.data)
        } else {
          setNotFound(true);
        }
      });
  }, [bookId, commentPosted]);



  if (notFound) {
    return (
      <ErrorMsg>"No book found with that ID."</ErrorMsg>
    );
  } else {

    return (
      <>
       {!book ?
       <h1>Loading...</h1>
       :
       book &&
        <Container>
          <BookImage src={book.image} />
          <div>
            <div>Title: {book.title}</div>
            <div>Author: {book.author}</div>
            <div>Publisher: {book.publisher}</div>
            <div>Category: {book.categories}</div>
            <div>Pages: {book.pageCount}</div>
            <div>Description: {book.description}</div>
            <button onClick={ handleClick}>Click here to preview</button>
            <button    onClick={(e) => {
               if (!isAuthenticated)
               {
                window.alert("Please log in first!")
               } else {
                addToFavoriteHandler(e, book);
                navigate("/profile");
               }
               
                 
                }}>+ Add to Favorite List
            </button>
            <Write>Write a comment about this book</Write>

            {isAuthenticated ? (
             <NewComment commentPosted={commentPosted} setCommentPosted={setCommentPosted} />
            ) :
            <p>Please log in so you can read comments and write a comment!</p>
            }
            
          </div>
        </Container>
      }
      </>  
      
    )
  }
}

const Container = styled.div`
  display: flex;
`

const BookImage = styled.img`
  margin-left: 1em;
  margin-right: 2em;
  padding: 1em;
  width: 300px;
  height: 200px;
  box-shadow: rgba(16, 55, 120, 0.3) 0px 1px 2px 0px,
    rgba(21, 31, 48, 0.15) 0px 1px 3px 1px;
  border-radius: 10px;
`;

const ErrorMsg = styled.div`
    font-family: "Arimo", sans-serif;
    font-weight: bold;
    margin-top: 40px;
    font-size: 22px;
    text-align: center;
`
const Write = styled.p`
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 19px;
  font-weight: bold;
`

export default BookDetails