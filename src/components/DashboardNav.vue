<template>
    <sui-segment class="dashboard-nav">
        <sui-menu vertical text v-for="item in items">
            <sui-menu-header @click="select()">{{ item.label }}</sui-menu-header>
            <sui-menu-item v-for="child in item.children" :key="child.label" :active="isActive(child.label)"
                          @click="select(child)">{{ child.label }}
            </sui-menu-item>
        </sui-menu>
    </sui-segment>
</template>

<script>
    import 'semantic-ui-css/semantic.min.css';
    import { EventBus } from '../main';

    export default {
        data: function () {
          return {
              items: [{
                  label: 'Deine Projekte',
                  children: [
                      {
                          label: 'Noch nicht freigegeben',
                          category: 'not published'
                      },
                      {
                          label: 'Von Dir freigegeben',
                          category: 'published'
                      }
                  ]
              }, {
                  label: 'Dir zugewiesene Projekte',
                  children: [
                      {
                          label: 'Noch nicht reviewt',
                          category: 'not reviewed'
                      },
                      {
                          label: 'Von Dir reviewt',
                          category: 'reviewed'
                      }
                  ]
              }
              ],
              active: 'Noch nicht freigegeben',
              category: ''
          }
        },
        methods: {
            logout: function () {
                firebase.auth().signOut().then(() => {
                    this.$router.replace('login');
                })
            },
            isActive(name) {
                return this.active === name;
            },
            select(item) {
                this.active = item.label;
                this.category = item.category;
                EventBus.$emit('onDashboardItemClick', this.category);
            },
        }
    }
</script>

<style>
    .content {
        margin-top: 1em;
        margin-bottom: 1em;
    }

    .header {
        font-weight: bold;
    }

</style>
