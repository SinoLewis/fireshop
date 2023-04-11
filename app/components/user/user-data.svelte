<svelte:options tag="user-data" />

<script lang="ts">
  import { cart, order } from "../../stores";

  let km;
  let metres;
  let mins;
  let seconds;

  order.subscribe((value) => {
    km = Math.floor(
      value.directions.features[0].properties.summary.distance / 1000
    );
    metres = value.directions.features[0].properties.summary.distance % 1000;
    mins = Math.floor(
      value.directions.features[0].properties.summary.duration / 60
    );
    seconds = value.directions.features[0].properties.summary.duration % 60;
  });
</script>

<div class="container">
  <div class="box">
    <div class="item">
      <div class="title">Cart 🛒</div>
      <div class="value">KSH {$cart.cart_price}</div>
      <div class="desc">Cart Total: {$cart.cart_total}</div>
    </div>
  </div>
  <div class="box">
    <div class="item">
      <div class="title">Delivery 🚚</div>
      <div class="value">
        {km | 0}.{metres | 0} KM
      </div>
      <div class="desc">
        {mins | 0} mins & {seconds | 0} seconds for delivery time
      </div>
    </div>
  </div>
  <!-- <div class="box">
    <div class="item">
      <div class="title">User 👤</div>
      <div class="value">{$user?.email}</div>
    </div>
    <div class="fig">
      <div class="profile">
        <div>
          <img src="/img/ui/avatar.svg" />
        </div>
      </div>
    </div>
  </div> -->
</div>

<style lang="scss">
  .container {
    @apply grid grid-cols-1 gap-3;
  }
  .box {
    overflow: hidden;
    // background: linear-gradient(
    //   176deg,
    //   rgb(0, 56, 80) 50%,
    //   rgb(8, 10, 15) 100%
    // );
    @apply stats bg-info-content m-4 text-white;
  }
  .item {
    overflow: hidden;
    @apply stat;
  }
  .value {
    @apply stat-value break-words;
  }
  .title {
    @apply stat-title;
  }
  .desc {
    @apply stat-desc;
  }
  // .fig {
  //   @apply stat-figure;
  // }
  // .profile {
  //   @apply avatar online;

  //   div {
  //     @apply w-16 rounded-full;
  //   }
  // }
</style>
