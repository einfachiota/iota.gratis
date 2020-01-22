import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

export const i18n = new VueI18n({
	locale: 'en',
	fallbackLocale: 'en',
	messages: {
		en:{
			title: 'iota.credit',
			headline: 'Get your first IOTA token for free!',
			address_palceholder: 'Add your IOTA recipient address here',
			iota_is_free: 'IOTA is feeless!',
			tx_on_thetangle: 'Watch transaction on',
			get_free_iota: 'Get your free IOTA!',
			how_it_works: 'How it works',
			get_trinity: 'Get the IOTA Trinity Wallet',
			available_tokens: 'Available Tokens',
			fill: 'Fill the Pot',
			spend_iota: 'Spend IOTA'
		},
		de: {
			title: 'iota.gratis',
			headline: 'Hol dir deine ersten IOTA Token gratis!',
			address_palceholder: 'Füge hier deine IOTA Empfänger Adress ein',
			iota_is_free: 'IOTA ist gebührenfrei!',
			tx_on_thetangle: 'Verfolge die Transaktion auf',
			get_free_iota: 'Gratis IOTA anfordern!',
			how_it_works: 'Wie funktioniert das?',
			get_trinity: 'Hol dir das IOTA Trinity Wallet',
			available_tokens: 'Verfügbare Tokens',
			fill: 'Fülle den Topf',
			spend_iota: 'Spende IOTA'
		}
	}
});