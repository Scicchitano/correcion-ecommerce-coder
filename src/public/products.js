document.addEventListener('DOMContentLoaded', () => {	
	// FILTERS
	const linkDesc = document.getElementById('linkDesc')
	linkDesc.addEventListener('click', () => {
		let url = new URL(window.location.href)
		url.searchParams.delete('sort')
		url.searchParams.set('sort', 'desc')
		linkDesc.href = url.href
	})

	const linkAsc = document.getElementById('linkAsc')
	linkAsc.addEventListener('click', () => {
		let url = new URL(window.location.href)
		url.searchParams.delete('sort')
		url.searchParams.set('sort', 'asc')
		linkAsc.href = url.href
	})

	const categoryHogar = document.getElementById('category-hogar')
	categoryHogar.addEventListener('click', () => {
		let url = new URL(window.location.href)
		url.searchParams.delete('query')
		url.searchParams.set('query', 'hogar')
		categoryHogar.href = url.href
	})

	const categoryDormitorio = document.getElementById('category-dormitorio')
	categoryDormitorio.addEventListener('click', () => {
		let url = new URL(window.location.href)
		url.searchParams.delete('query')
		url.searchParams.set('query', 'dormitorio')
		categoryDormitorio.href = url.href
	})

	const categoryJardin = document.getElementById('category-jardin')
	categoryJardin.addEventListener('click', () => {
		let url = new URL(window.location.href)
		url.searchParams.delete('query')
		url.searchParams.set('query', 'jardin')
		categoryJardin.href = url.href
	})

	const categoryEscritorios = document.getElementById('category-escritorios')
	categoryEscritorios.addEventListener('click', () => {
		let url = new URL(window.location.href)
		url.searchParams.delete('query')
		url.searchParams.set('query', 'escritorios')
		categoryEscritorios.href = url.href
	})

	const statusTrue = document.getElementById('status-true')
	statusTrue.addEventListener('click', () => {
		let url = new URL(window.location.href)
		url.searchParams.delete('query')
		url.searchParams.set('query', 'true')
		statusTrue.href = url.href
	})

	const statusFalse = document.getElementById('status-false')
	statusFalse.addEventListener('click', () => {
		let url = new URL(window.location.href)
		url.searchParams.delete('query')
		url.searchParams.set('query', 'false')
		statusFalse.href = url.href
	})

	const deleteFilters = document.getElementById('delete-filters')
	deleteFilters.addEventListener('click', () => {
		let url = new URL(window.location.href)
		url.searchParams.delete('query')
		deleteFilters.href = url.href
	})

	// CART LOGIC
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
})
