<template>
  <div class="home">
    <div class="hero">
      <h1 class="heading">
        <i18n path="about.heading" />
      </h1>
      <p class="sub-heading">
        <i18n path="about.subheading" />
      </p>
    </div>

    <div class="section section-background black">
      <div class="container">
        <div>
          <a
            target="_blank"
            href="https://github.com/einfachiota/iota.gratis"
            rel="noreferrer"
          ><i18n path="about.gratislink" /></a>
          <br>
          <br><i18n path="about.modulelink1" />
          <a
            target="_blank"
            href="https://github.com/machineeconomy/iota-payment"
            rel="noreferrer"
          ><i18n path="about.modulelink2" /></a><i18n path="about.modulelink3" />
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss">
 .black {
   padding-top: 30px;
  color: var(--dark);
  a{
    color: black;
  }
}
</style>