<svelte:options tag="testin-button" />

<script lang="ts">
  import Openrouteservice from "openrouteservice-js";

  let routeBody = {};

  let nomatim = {
    place_id: 12196368,
    licence:
      "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    osm_type: "node",
    osm_id: 1276749986,
    boundingbox: ["-1.2859577", "-1.2858577", "36.8803619", "36.8804619"],
    lat: "-1.2859077",
    lon: "36.8804119",
    display_name:
      "Jimlizer Hotel, Mumias South Road, Buru Buru Phase 2, Buruburu, Uhuru Estate, Nairobi, Nairobi County, Nairobi, 00515, Kenya",
    class: "tourism",
    type: "hotel",
    importance: 0.10000999999999996,
    icon: "https://nominatim.openstreetmap.org/ui/mapicons/accommodation_hotel2.p.20.png",
  };

  // const Matrix = new Openrouteservice.Matrix({
  //   api_key: import.meta.env.VITE_OPEN_ROUTE,
  // });
  // Matrix.calculate({
  //   locations: [
  //     [8.690958, 49.404662],
  //     [8.687868, 49.390139],
  //     [8.687868, 49.390133],
  //   ],
  //   profile: "driving-car",
  //   sources: ["all"],
  //   destinations: ["all"],
  // })
  //   .then(function (json) {
  //     let routeBody = JSON.stringify(json);

  //     console.log("ROUTE RESPONSE: ", routeBody);
  //   })
  //   .catch(function (err) {
  //     console.error(err);
  //   });
</script>

<!-- The button to open modal -->
<label for="my-modal">open modal</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="my-modal" class="toggle" />
<div class="popup">
  <div class="box">
    <h3>Congratulations random Internet user!</h3>
    <p>
      You've been selected for a chance to get one year of subscription to use
      Wikipedia for free!
    </p>
    <div>
      <label for="my-modal">Yay!</label>
    </div>
  </div>
</div>

<style lang="scss">
  .toggle {
    @apply modal-toggle;
  }
  .popup {
    @apply modal;
  }
  .box {
    @apply modal-box;
    h3 {
      @apply font-bold text-lg;
    }
    p {
      @apply py-4;
    }
    div {
      @apply modal-action;
    }
  }

  label {
    @apply btn;
  }
</style>
