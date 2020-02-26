<template>
  <div class="home">
    <div class="hero">
      <h1 class="heading">
        <i18n path="headline" />
      </h1>
    </div>

    <div class="section">
      <div class="container">
        <Form />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Form from '@/components/Form';
import axios from 'axios';

export default {
	name: 'Home',
	components: {
		Form
	},
	data() {
		return {
			total_tokens: '',
			network: process.env.VUE_APP_NETWORK
		};
	},
	created() {
		this.getTotalTokens();
	},
	methods: {
		getTotalTokens() {
			let self = this;
			axios
				.get(process.env.VUE_APP_URL+'/get_balance')
				.then(response => {
					self.total_tokens = response.data.balance;
				}).catch(err => {
					console.log('err', err);
				});
		}
	}
};
</script>

<style lang="scss">
.el-main {
  padding: 0px !important;
}
.home {
  text-align: center;
  color: #fff;
  min-height: calc(100vh - 60px);
}
.hero {
  margin: 0 10px;
}

.heading {
  margin-top: 15vh;
}
.section {
  &-background {
    background-color: var(--light);
    p {
      max-width: 600px;
      margin: 15px auto 30px;
    }
    a {
      text-decoration: none;
    }
  }

  .headline-wrapper {
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  button {
    margin: 0 auto;
    max-width: 500px;
    margin-top: 15px;
    padding: 15px 20px;
    border: 0;
    border-radius: 8px;
    outline: none;
    color: var(--light);;
    font-size: 24px;
    line-height: 29px;
    text-decoration: none;
    background-color: var(--gratis-yellow);
    box-shadow: var(--light);
    cursor: pointer;
    &:hover {
      background-color: var(--gratis-yellow-light);
    }
  }
}

.container{
  margin-bottom: 40px;
}

.tokens {
  font-size: 2em;
  padding: 20px 30px;
}
@media only screen and (max-width: 740px) {
  .hero {
      padding-top: 40px;
  }
  .headline-wrapper {
    flex-wrap: wrap;
    h2 {
      margin-bottom: 20px;
    }
  }
  .btn-social  {
      margin-bottom: 5px !important;
  }
}

</style>