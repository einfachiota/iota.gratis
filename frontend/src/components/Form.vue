<template>
  <el-form
    ref="ruleForm"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="120px"
    label-position="top"
  >
    <el-form-item prop="address">
      <el-input
        v-model="ruleForm.address"
        class="address_input"
        type="text"
        autocomplete="off"
        :placeholder="$t('address_palceholder')"
      />
    </el-form-item>
    <router-link
          class="link"
          to="about"
        >
          <i18n path="how_it_works" />
    </router-link>
    <div v-if="payout_sent && txhash.length !== 81">
      <p>
        <i18n path="tx_on_thetangle" />
        <a
          v-if="network == 'Devnet'"
          :href="'https://devnet.thetangle.org/address/' + ruleForm.address"
          target="_blank"
        >TheTange.org</a>
        <a
          v-else
          :href="'https://thetangle.org/address/' + ruleForm.address"
          target="_blank"
        >TheTange.org</a> .
      </p>
    </div>
    <div v-else-if="txhash.length === 81">
      <p>
        <i18n path="tx_on_thetangle" />:
        <a
          v-if="network == 'Devnet'"
          :href="'https://devnet.thetangle.org/transaction/' + txhash"
          target="_blank"
        >devnet.thetangle.org</a>
        <a
          v-else
          :href="'https://thetangle.org/transaction/' + txhash"
          target="_blank"
        >thetangle.org</a>
      </p>
    </div>
    <div v-if="typeof ruleForm.errors !== 'undefined' && ruleForm.errors.length > 0">
      <p
        v-for="(error, index) in ruleForm.errors"
        :key="index"
      >
        {{ error }}
      </p>
    </div>
    <el-form-item>
      <div v-if="error">
        {{ cantsendmsg }}
      </div>
      <div v-if="cantsendpayout">
        {{ cantsendmsg }}
      </div>
      <el-button
        v-else
        type="primary"
        @click="send('ruleForm')"
      >
        <i18n path="get_free_iota" />
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from 'axios';
import { isValidChecksum, addChecksum } from '@iota/checksum';
import { isTrytes } from '@iota/validators';
import io from 'socket.io-client';
const socket = io(process.env.VUE_APP_URL, {
	path: '/iotapay/socket'
});

export default {
	name: 'Form',
	data() {
		var validateAddress = (rule, address, callback) => {
			console.log('address:', address);
			//accept any 81 tryte string as address, only for devnet
			if (this.network == 'Devnet') {
				let match = /[A-Z+9]{81}/.exec(address);
				if (match == null) {
					return callback(new Error('Bitte gib eine IOTA Adresse an.'));
				}
				address = addChecksum(address.slice(match.index, match.index + 81));
				this.ruleForm.address = address;
			} else {
				address = address.trim();
				this.ruleForm.address = address.trim();
			}
			console.log(address);

			if (!address) {
				return callback(new Error('Bitte gib eine IOTA Adresse an.'));
			} else if (
				!isTrytes(address) ||
        (address.length != 90 && address.length != 81)
			) {
				callback(new Error('Dies ist keine gültige IOTA Adresse'));
			} else if (address.length == 90 && !isValidChecksum(address)) {
				callback(new Error('Ungültige Checksumme'));
			} else {
				callback();
			}
		};
		return {
			payout_sent: false,
			cantsendpayout: false,
			cantsendmsg: 'Bitte versuch es später noch einmal.',
			txhash: 'empty',
			network: process.env.VUE_APP_NETWORK,
			error: false,
			ruleForm: {
				address: '',
				value: 1,
				message: '',
				errors: []
			},
			rules: {
				address: [{ validator: validateAddress, trigger: 'blur' }]
			}
		};
	},
	created() {
		let self = this;
		socket.on('payouts', function(data) {
			self.txhash = data.payout.txhash;
		});
	},
	methods: {
		send(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					console.log('submit!', this.ruleForm);
					let self = this;
					this.ruleForm.errors = [];
					axios
						.post(process.env.VUE_APP_URL + '/pay_tokens', this.ruleForm)
						.then(response => {
							console.log('response', response);
							//exit if max amount reached
							if (response.data.type == 'cantsend') {
								this.cantsendmsg = response.data.msg;
								this.cantsendpayout = true;
								return;
							}
							if (response.data.type == 'error') {
								this.cantsendmsg = response.data.msg;
								this.error = true;
								return;
							} else {
								this.error = false;
							}
							let data = response.data;
							if (!data) {
								self.ruleForm.errors.push('Invalid data');
							} else if (data === 'Invalid address') {
								self.ruleForm.errors.push('Invalid address');
								console.log('Server responded with invalid address');
							} else if (data.address) {
								socket.emit('storeClientInfo', {
									paymentOrPayoutId: response.data.id
								});
								self.payout_sent = true;
							}
						})
						.catch(err => {
							console.log('err', err);
						});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		changePayoutValue(value) {
			this.ruleForm.value = value.srcElement.value;
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
form {
  display: flex;
  flex-direction: column;
}
.address_input {
  .el-input__inner {
    width: 100%;
    height: 80px;
    margin: 20px auto;
    font-size: 1em;
    text-align: center;
    border-radius: 10px;
  }
}

::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: gray;
  opacity: 1; /* Firefox */
  font-size: 1.2em;
  text-align: center;
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: gray;
}

::-ms-input-placeholder {
  /* Microsoft Edge */
  color: gray;
}
a {
  margin: 5px;
  border: 2px solid transparent;
  font-weight: 300;
  line-height: 20px;
  white-space: nowrap;
  color: var(--light);
  cursor: pointer;
  &:hover {
    color: var(--iota-yellow);
  }
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 12px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
  &:hover {
    opacity: 1;
  }
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: var(--primary-darken);
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #4caf50;
    cursor: pointer;
  }
}

.link {
  text-decoration: none;
  z-index: 1000;
  font-size: 1.5em;
  :hover {
    color: var(--iota-yellow);
  }
}
</style>
