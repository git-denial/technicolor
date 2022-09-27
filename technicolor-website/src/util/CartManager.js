export default class CertManager {

    static getCartContent = () => {
        // localStorage.cart = JSON.stringify([])
        let initialStorage = []

        if (localStorage.cart) {
            try {
                initialStorage = JSON.parse(localStorage.cart)
            } catch (e) {
                console.log(e)
            }
        }

        return initialStorage
    }

    static addToCart = (product) => {
        let initialCartState = CertManager.getCartContent()

        if (initialCartState?.push) {
            initialCartState.push(product)
        }

        this.storeCartData(initialCartState)

        return initialCartState
    }

    static storeCartData = (newState) => {
        localStorage.cart = JSON.stringify(newState)
    }

    static removeItem = (index) => {
        let initialCartState = CertManager.getCartContent()

        initialCartState.splice(index, 1);

        this.storeCartData(initialCartState)

        return initialCartState
    }

    static addItemQuantity = (index) => {
        let initialCartState = CertManager.getCartContent()

        let toBeEditedItem = initialCartState[index]

        toBeEditedItem.quantity = toBeEditedItem.quantity + 1

        initialCartState[index] = toBeEditedItem

        this.storeCartData(initialCartState)

        return initialCartState
    }

    static decreaseItemQuantity = (index) => {
        let initialCartState = CertManager.getCartContent()

        let toBeEditedItem = initialCartState[index]

        toBeEditedItem.quantity = toBeEditedItem.quantity - 1 < 1 ? 1 : toBeEditedItem.quantity - 1

        initialCartState[index] = toBeEditedItem

        this.storeCartData(initialCartState)

        return initialCartState
    }

    static emptyCart = () => {
        // localStorage.cart = JSON.stringify([])
        let initialStorage = []
        this.storeCartData(initialStorage)

    }

}
