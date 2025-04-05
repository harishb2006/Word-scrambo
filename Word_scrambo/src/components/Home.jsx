import rect from '../assets/Rectangle.png';
import playimg from '../assets/Vector.png';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/game');
  };
  return (
    <div className='bg-[#00B3C3] h-screen w-full'>
        <h1 className='absolute mt-[36px] text-2xl font-medium ml-[10px]'>Word Scrambo</h1>
      <img src={rect} alt="Background rectangle" className="pt-[20px]" />
      <img src={playimg} alt="Play button" className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer "  onClick={handleClick}/>
      <h1 className='  text-2xl font-medium justify-center absolute top-[60%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 mt-[30px]' >Start</h1>
    </div>
  );
};

export default Home;
