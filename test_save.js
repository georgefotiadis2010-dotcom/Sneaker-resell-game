// Quick test to see what's in localStorage
const saved = localStorage.getItem('sneakerGameSave');
if (saved) {
    const state = JSON.parse(saved);
    console.log('Saved nextAIAuction:', state.nextAIAuction);
    console.log('Saved availableShoes count:', state.availableShoes?.length);
    console.log('Saved activeAuctions count:', state.activeAuctions?.length);
} else {
    console.log('No save found');
}
