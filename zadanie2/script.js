const app = new Vue({
  el: '#app',
  data: {
    search: '',
    filters: {
      type: [],
      status: [],
      price: []
    },
	options: {},
    priceRange: {},
    books: [],
    headers: [
      {
        text: 'ID',
        align: 'left',
        sortable: false,
        value: 'ident'
      },
      {
        text: 'Okładka',
        align: 'left',
        sortable: false,
        value: 'okladka'
      },
      {
        text: 'Tytuł',
        align: 'left',
        sortable: true,
        value: 'tytul'
      },
      {
        text: 'Autor',
        align: 'left',
        sortable: true,
        value: 'autor'
      },
      {
        text: 'Cena',
        align: 'left',
        sortable: true,
        value: 'cena'
      },
      {
        text: 'Typ',
        align: 'left',
        sortable: true,
        value: 'typ'
      },
      {
        text: 'Status',
        align: 'left',
        sortable: true,
        value: 'status'
      }
    ]
  },
  computed: {
	filteredBooks() {
		let books = this.books;
		/* check for books with specific type */
		if (this.filters.type.length > 0) {
			books = books.filter(book => this.filters.type.includes(book['typ']));
		}
		/* check for books with specific status */
		if (this.filters.status.length > 0) {
			books = books.filter(book => this.filters.status.includes(book['status']));
		}
		/* check for books in price range */
		if (this.filters.price.length > 0) {
			books = books.filter(book => parseFloat(book.cena) >= this.filters.price[0] && parseFloat(book.cena) <= this.filters.price[1]);
		}
		return books;
	}
  },
  methods: {
    /* fetch books list from json file */
    fetchBooks() {
      fetch('books.json')
        .then(res => res.json())
        .then(data => {
          this.books = data;
          this.createValuesListOf('typ');
          this.createValuesListOf('status');
          this.findPriceRange();
        })
        .catch(err => console.log(err))
    },
    /* return existing values of certain field for filtering options */
    createValuesListOf(val) {
      /* remove duplicates with Set */
	  this.options[val] = Array.from(new Set(this.books.map(book => book[val])))
	  this.options[val].sort((a, b) => {
		return a - b;
	  })
	},
	/* find price range from fetched books */
    findPriceRange() {
      let prices = this.books.map(book => parseFloat(book['cena']));
	  this.priceRange.min = Math.min(...prices) - 1;
	  this.priceRange.max = Math.max(...prices);
	  this.filters.price = [this.priceRange.min, this.priceRange.max];
    }
  },
  created() {
    this.fetchBooks();
  }
})