<svelte:options tag="no-user" />

<h2>You're signed out 😞... Sign in To use this Page</h2>
<modal-action type="open" name="signin">
  <btn>Open Login</btn>
</modal-action>

<style lang="scss">
  btn {
    @apply btn cursor-pointer px-4 py-2 text-xl font-display text-white bg-black hover:bg-purple-600 drop-shadow-[6px_6px_0_black] hover:drop-shadow-[0_0_7px_rgba(168,85,247,0.5)] transition-all duration-300;
  }
</style>
