import React, { useState } from 'react';
import { getCategories } from '../../store/categories/categories.slice';
import { useSelector } from 'react-redux';
import Button from '../../components/ui/common/button/Button';
import CategoryCard from '../../components/ui/categoryCard/CategoryCard';
import ModalWindowCategory from '../../components/ui/modalWindowCategory/ModalWindowCategory';
import styles from './categories.module.scss';

const Categories = () => {
  const categories = useSelector(getCategories());
  const [modalActive, setModalActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleModal = (id) => {
    if (typeof id === 'string') {
      setSelectedCategory(id);
    } else {
      setSelectedCategory('');
    }
    setModalActive(!modalActive);
  };

  return (
    <>
      <Button
        title={'Добавить категорию'}
        className={styles.btnAddCategory}
        handler={handleModal}
      />
      <div className={styles.grid_container}>
        {categories &&
          categories.map((category) => {
            return (
              <CategoryCard
                category={category}
                handleModal={handleModal}
                modalActive={modalActive}
                setModalActive={setModalActive}
                color={category.color}
                id={category._id}
                key={category._id}
                name={category.name}
              />
            );
          })}
      </div>
      <ModalWindowCategory
        categories={categories}
        selectedCategory={selectedCategory}
        modalActive={modalActive}
        setModalActive={setModalActive}
      />
    </>
  );
};

export default Categories;
