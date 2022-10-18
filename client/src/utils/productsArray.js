import PapasKetchup from '../assets/img/jpg/papas-ketchup.jpg'
import HamburguesaQuesoCheddar from '../assets/img/jpg/burger-1.jpg'
import PizzaQuesoJamonAnchoas from '../assets/img/jpg/pizza-2.jpg'
import PizzaMuzarellaAnchoas from '../assets/img/jpg/pizza-1.jpg'
import HamburguesaCheddarJamonLechugaTomate from '../assets/img/jpg/burger-3.jpg'


export const products = [
    {
        id: 1,
        disponibility: true,
        name: 'Papas con Ketchup',
        productType: 'Papas',
        price: 50,
        rating: 5,
        image: PapasKetchup,
        description: 'Una ricas papas con ketchup'
    },
    {
        id: 2,
        disponibility: true,
        name: 'Hamburguesa con Cheddar',
        productType: 'Hamburguesa',
        price: 100,
        rating: 5,
        image: HamburguesaQuesoCheddar,
        description: 'Deliciosa hamburguesa con Queso Cheddar',
    },
    {
        id: 3,
        disponibility: true,
        name: 'Hamburguesa Completa',
        productType: 'Hamburguesa',
        price: 100,
        rating: 5,
        image: HamburguesaCheddarJamonLechugaTomate,
        description: 'Una llenadora hamburguesa con Queso Cheddar, Jamón, Lechuga y Tomate',
    },
    {
        id: 4,
        disponibility: true,
        name: 'Pizza: con Anchoas',
        productType: 'Pizza',
        price: 100,
        rating: 5,
        image: PizzaQuesoJamonAnchoas,
        description: 'Sabrosa pizza de Queso Jamón y Anchoas',
    },
    {
        id: 5,
        disponibility: true,
        name: 'Pizza: Muzarella y Anchoas',
        productType: 'Pizza',
        price: 100,
        rating: 5,
        image: PizzaMuzarellaAnchoas,
        description: 'Excelente pizza de Muzarella y Anchoas',
    },
]