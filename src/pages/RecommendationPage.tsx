import './RecommendationPage.css';
import Logo from '../components/Logo';
import NavigationPane from '../components/NavigationPane';
import BookCard from '../components/BookCard';
import Filter from '../components/RecommendationsFilter'; 

function RecommendationPage() {
  return (
    <>
      <Logo position="top" />
      <div className="recommendation-page">
        <Filter />
        <BookCard 
          title="Fahrenheit 451" 
          author="Ray Bradbury" 
          release="1953"
          description="Fahrenheit 451 is a dystopian novel 
          by Ray Bradbury about a future society where books 
          are banned and 'firemen' burn any that are found. 
          The story follows Guy Montag, a fireman who 
          becomes disillusioned with his job after a series 
          of events—including the death of his neighbor 
          Clarisse and witnessing a woman die with her 
          books—leading him to secretly read books and 
          question society's censorship and focus on 
          superficial entertainment. Montag escapes the 
          mechanical hound sent to capture him and flees to 
          a community of outcasts who have memorized books 
          to preserve them, all while the city he left is 
          destroyed by war."
          genres={['Dystopian', 'Sci-Fi', 'Classic', 'Literature']} />
          <NavigationPane />
      </div>
    </>
  );
}

export default RecommendationPage;
