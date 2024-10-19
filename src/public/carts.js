document.addEventListener('DOMContentLoaded', () => {
	const numbersElements = document.querySelectorAll('.number')
	const productsStocks = document.querySelectorAll('.stock')

	const minusButtons = document.querySelectorAll('.minus')
	for (const button of minusButtons) {
		button.addEventListener('click', () => {
            
			const productId = button.getAttribute('data-product-id')
            
			let currentNumber 
			for (const number of numbersElements) {
				const numberId = number.getAttribute('data-product-id') 
				if(numberId === productId){
					currentNumber = number
				}
			}

			let number = parseInt(currentNumber.innerHTML)

			if(number > 0){
				currentNumber.innerHTML = number - 1
			} else if (number === 0){
				return
			} 
		})
	}

	const addButtons = document.querySelectorAll('.add')
	for (const button of addButtons) {
		button.addEventListener('click', () => {
            
			const productId = button.getAttribute('data-product-id')
            
			let currentNumber 
			for (const number of numbersElements) {
				const numberId = number.getAttribute('data-product-id') 
				if(numberId === productId){
					currentNumber = number
				}
			}

			let currentStock  
			for (const stock of productsStocks) {
				const stockId = stock.getAttribute('data-product-id') 
				if(stockId === productId){
					currentStock = stock
				}
			}

			let number = parseInt(currentNumber.innerHTML)
			let stock = parseInt(currentStock.innerHTML)

			if(number < stock){
				currentNumber.innerHTML = number + 1
			} else if (number > stock){
				return
			} 
		})
	}

	const addToCartButtons = document.querySelectorAll('.addToCart')
	for (const button of addToCartButtons) {
		button.addEventListener('click', () => {
			const productId = button.getAttribute('data-product-id')
            
			let productQuantity 
			for (const number of numbersElements) {
				const numberId = number.getAttribute('data-product-id') 
				if(numberId === productId){
					productQuantity = number
				}
			}

			const newProduct = {
				id: productId,
				quantity: parseInt(productQuantity.innerHTML)
			}

			fetch(`http://localhost:8080/api/carts/64e792367d17e9cc371c7c06/product/${newProduct.id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(newProduct)
			})
				.then((res) => {
					productQuantity.innerHTML = 0

					const Toast = Swal.mixin({
						toast: true,
						position: 'bottom-end',
						showConfirmButton: false,
						timer: 2000,
						timerProgressBar: true,
						didOpen: (toast) => {
							toast.addEventListener('mouseenter', Swal.stopTimer)
							toast.addEventListener('mouseleave', Swal.resumeTimer)
						}
					})

					Toast.fire({
						icon: 'success',
						title: 'El producto se ha agregado exitosamente al carrito.'
					})
				})
				.catch((error) => {
					productQuantity.innerHTML = 0

					const Toast = Swal.mixin({
						toast: true,
						position: 'bottom-end',
						showConfirmButton: false,
						timer: 2000,
						timerProgressBar: true,
						didOpen: (toast) => {
							toast.addEventListener('mouseenter', Swal.stopTimer)
							toast.addEventListener('mouseleave', Swal.resumeTimer)
						}
					})
                    
					Toast.fire({
						icon: 'error',
						title: `${error}`
					})
				})
		})
	}

	const deleteOfCartButtons = document.querySelectorAll('.deleteOfCart')
	for (const button of deleteOfCartButtons) {
		button.addEventListener('click', () => {
			const productId = button.getAttribute('data-product-id')
			
			fetch(`http://localhost:8080/api/carts/64e792367d17e9cc371c7c06/product/${productId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((res) => {
					location.reload()
				})
				.catch((error) => {
					const Toast = Swal.mixin({
						toast: true,
						position: 'bottom-end',
						showConfirmButton: false,
						timer: 2000,
						timerProgressBar: true,
						didOpen: (toast) => {
							toast.addEventListener('mouseenter', Swal.stopTimer)
							toast.addEventListener('mouseleave', Swal.resumeTimer)
						}
					})
					
					Toast.fire({
						icon: 'error',
						title: `${error}`
					})
				}) 
		})
	}
})