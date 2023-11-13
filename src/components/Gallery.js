import '../gallery.css';
import {useState, useEffect} from 'react';
import React from 'react';
import photosService from '../services/photos';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const fetchLimit = 10;

  const fetch = () => {
    try {
      const cachedPhotos = localStorage.getItem('cachedPhotos');
      if (cachedPhotos) {
        setPhotos(JSON.parse(cachedPhotos));
      }
      photosService.getPhotos({page, fetchLimit}).then((res) => {
        setPhotos((photos) => [...photos, ...res]);
        setPage((page) => page + 1);
        localStorage.setItem('cachePhotos', JSON.stringify());
      });
    } catch (error) {
      console.error('error thrown when fetching photos', error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleScroll = () => {
    if (window.innerWidth +
      document.documentElement.scrollLeft <=
      document.documentElement.scrollWidth - 100) {
      return;
    }
    fetch();
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const reorder = (arr, index) => {
    if (index === 0) {
      return arr;
    }
    for (let i = arr.length - 1; i >= 1; i--) {
      const j = Math.floor(Math.random() % (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return reorder(arr, index - 1);
  };

  const handleReorderClick = () => {
    const reorderedPhotos = reorder([...photos], photos.length - 1);
    localStorage.setItem('cachedPhotos', JSON.stringify(reorderedPhotos));
    setPhotos(reorderedPhotos);
  };

  return (
    <>
      <h1 className='h1-header'>Photo Gallery</h1>
      <div className='photo-container'>
        {photos.map((photo) => (
          <div key={photo.id} className='photo-card'>
            <img
              className='photo-image'
              src={photo.thumbnailUrl}
              alt={photo.title}
            />
            <div className='overlay'>
              <p className='overlay-text'>{photo.title}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='button-container'>
        <div className='button-container-center '>
          <button onClick={handleReorderClick}>Reorder</button>
        </div>
      </div>
    </>
  );
};

export default Gallery;
