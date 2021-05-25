<template>
    <v-btn @click="back" class="word">
        <div class="word">back</div>
    </v-btn>
</template>
<script>
export default {
    methods:{
        back(){
            this.$router.back();
        }
    }
}
</script>
<style>
    .word{
        font-family:"Yu Gothic", "游ゴシック", YuGothic, "游ゴシック体";
    }
</style>