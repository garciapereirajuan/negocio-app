import { Box, Grid, Fade } from '@mui/material';
import Product from '../Product'
import ProductOfBasket from '../ProductOfBasket'

import './Products.css'

export default function Products({ allMainProducts, allBonusProducts, setTotal, total, setBasket, fromBasket, reloadBasket, reloadTotal, setReloadBasket, setReloadTotal }) {
    let array = []

    const getBonusProducts = (mainProduct) => {

        allBonusProducts && allBonusProducts.forEach(itemWithData => {
            mainProduct?.bonusProducts.forEach(item => {
                if (item === itemWithData._id) {
                    array.push(itemWithData)
                }
            })
        })
    }

    return (
        <Box xs={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                {
                    allMainProducts && allMainProducts.map(item => {
                        array = []

                        if (item?.bonusProducts.length !== 0) {
                            getBonusProducts(item)
                        }

                        if (!fromBasket) {
                            return item.visible && (
                                <Product 
                                    key={item.id} 
                                    product={item}
                                    bonusProducts={array}
                                    bonusProductsOk={item.bonusProductsOk || undefined}
                                    setTotal={setTotal}
                                    total={total}
                                    setBasket={setBasket}
                                />
                            )
                        }

                        return item.visible && (
                            <ProductOfBasket 
                                key={item.id} 
                                product={item}
                                bonusProducts={array}
                                bonusProductsOk={item.bonusProductsOk || undefined}
                                setTotal={setTotal}
                                total={total}
                                setBasket={setBasket}
                                reloadBasket={reloadBasket}
                                reloadTotal={reloadTotal}
                                setReloadBasket={setReloadBasket}
                                setReloadTotal={setReloadTotal}
                            />
                        )   
                    })
                }
            </Grid>
        </Box>
    );
}
