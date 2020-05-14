<script>
  import { dataStore } from "./store";
  let results = JSON.stringify($dataStore);
</script>

{results ? results : ""}