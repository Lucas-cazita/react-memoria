export const formatTimeElapsed = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
}