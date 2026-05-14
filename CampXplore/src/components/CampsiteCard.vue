<template>
    <div class="col">
        <div class="card shadow-sm h-100">
            <div class="card-body">
                <div class="d-flex align-items-start justify-content-between">
                    <h2>{{ campsite.name }}</h2>
                    <span class="badge p-2" :class="classeType(campsite.type)">{{ campsite.type }}</span>
                </div>
                <div class="row">
                    <div class="col-md-7">
                        <p><em>{{ campsite.location }}</em></p>
                        <p>{{ campsite.description }}</p>
                        <p><strong>Prix par nuit:</strong> {{ campsite.pricePerNight }}.00$</p>
                        <p><strong>Capacité:</strong> {{ campsite.capacity }} personnes</p>
                        <p v-if="campsite.type === 'vr'"><strong>Longuer maximale du vr:</strong> {{
                            campsite.maxVehicleLength }}m</p>
                    </div>
                    <div class="col-md-5">
                        <p class="mb-0"><strong>Équipements:</strong></p>
                        <ul class="m-0 p-0">
                            <li class="list-unstyled" v-for="amenity in campsite.amenities" :key="amenity">{{ amenity }}</li>
                        </ul>
                    </div>
                </div>
                <div>
                    <RouterLink class="btn btn-primary position-absolute bottom-0 end-0 m-3"
                        :to="{ name: 'CampsitesDetails', params: { id: campsite._id } }">Réserver</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

/**
 * Identifie la classe à afficher pour le type de camping
 * @param type Le type de camping
 * @returns La classe à afficher
 */
function classeType(type) {
    switch (type) {
        case "tente":
            return "bg-success";
        case "vr":
            return "bg-secondary";
        case "glamping":
            return "bg-info";
        case "arrière-pays":
            return "bg-warning";
        case "chalet":
            return "bg-danger";
        default:
            return "bg-light text-dark";
    }
}

defineProps({
    campsite: {
        type: Object,
        required: true,
    },
})
</script>