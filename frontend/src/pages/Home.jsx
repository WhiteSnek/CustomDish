import React from 'react'
import Restaurant from '../components/Restaurant'
import Categories from '../components/Categories'
import PopularDishes from '../components/PopularDishes'

const Home = () => {
  return (
    <div>
      <Categories />
      <PopularDishes />
      <Restaurant />
    </div>
  )
}

export default Home
