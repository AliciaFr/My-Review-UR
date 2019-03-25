<template>
    <div class="file-structure">
        <sui-button inverted @click="getRepoFileStructure()">Repo File Structure</sui-button>
    </div>
</template>

<script>
    import repoFileStructureMixin from '../mixins/repoFileStructureMixin';

    export default {
        data() {

        },
        mixins: [repoFileStructureMixin]
    }
</script>