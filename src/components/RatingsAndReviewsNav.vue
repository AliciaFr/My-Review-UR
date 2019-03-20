<template>
    <div>
        <sui-menu pointing secondary>
            <a
                    is="sui-menu-item"
                    v-for="item in items"
                    :active="isActive(item)"
                    :key="item"
                    :content="item"
                    @click="select(item)"
            />
        </sui-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                active: 'Erhaltene Reviews',
                items: ['Erhaltene Reviews', 'Erstellte Reviews'],
            };
        },
        methods: {
            isActive(name) {
                return this.active === name;
            },
            select(name) {
                this.active = name;
            },
        },
    };
</script>