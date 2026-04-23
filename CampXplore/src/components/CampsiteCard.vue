<template>
    <div class="col">
        <div class="card shadow-sm h-100">
            <div class="card-body">
                <h2>{{ campsite.name }}</h2>
                <div class="row">
                    <div class="col-md-8">
                        <p>{{ campsite.location }}</p>
                        <p>{{ campsite.description }}</p>
                    </div>
                    <div class="col-md-4">
                        <p>Type: {{ campsite.type }}</p>
                        <p>Prix par nuit: {{ campsite.pricePerNight }}</p>
                        <p>Capacité: {{ campsite.capacity }}</p>
                        <p v-if="campsite.type === 'vr'">Longuer maximale du vr: {{ campsite.maxVehicleLength }}</p>
                    </div>
                </div>
                <ul class="m-0 p-0">
                    <li class="list-unstyled" 
                        v-for="amenity in campsite.amenities" 
                        :key="amenity">
                        {{ amenity }}
                    </li>
                </ul>
                <div>
                    <RouterLink class="btn btn-primary position-absolute bottom-0 end-0 m-3" :to="{name: 'CampsitesDetails', params: {id: campsite._id}}">Réserver</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        campsite : {
            type: Object,
            required: true,
        },
    })
</script>