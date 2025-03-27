export {};

// import { logApiCall } from './constants';
// import {TrackItemVO} from "../../../shared/vo";
//
// let mockSelectionInterval: ReturnType<typeof setInterval> | undefined;
// let availableNodeIds: string[] = [];
//
// export const listenTS = (event: string, callback: (data: any) => void) => {
//   logApiCall(`listenTS:${event}`, 'start', { event });
//
//   if (event === 'activeSequenceChanged') {
//     const interval = setInterval(() => {
//       const data = {
//         activeSequence: {
//           id: Math.floor(Math.random() * 1000),
//           sequenceID: `seq_${Date.now()}`,
//           name: `Sequence ${Math.floor(Math.random() * 100)}`,
//           videoDisplayFormat: 108,
//           videoFrameRate: 29.97,
//           videoFrameSize: [1920, 1080],
//           audioDisplayFormat: 1,
//           audioFrameRate: 48000
//         }
//       };
//       logApiCall('activeSequenceChanged', 'event', data);
//       callback(data);
//     }, 20000);
//
//     return () => {
//       clearInterval(interval);
//       logApiCall('activeSequenceChanged', 'unsubscribe');
//     };
//   }
//
//   if (event === 'activeSequenceSelectionChanged') {
//     if (mockSelectionInterval) {
//       clearInterval(mockSelectionInterval);
//     }
//
//     mockSelectionInterval = setInterval(() => {
//       if (availableNodeIds.length === 0) {
//         const elements = document.querySelectorAll('[data-node-id]');
//         availableNodeIds = Array.from(elements).map(el => el.getAttribute('data-node-id')!);
//       }
//
//       if (availableNodeIds.length === 0) return;
//
//       const mockTrackItems: TrackItemVO[] = [];
//       const numSelected = Math.floor(Math.random() * 2) + 1;
//       const selectedIndices = new Set<number>();
//
//       while (selectedIndices.size < numSelected && selectedIndices.size < availableNodeIds.length) {
//         const index = Math.floor(Math.random() * availableNodeIds.length);
//         if (!selectedIndices.has(index)) {
//           selectedIndices.add(index);
//           const nodeId = availableNodeIds[index];
//           mockTrackItems.push({
//             name: `clip_${nodeId}`,
//             nodeId,
//             duration: { seconds: 1800, ticks: '1800' },
//             inPoint: { seconds: 0, ticks: '0' },
//             outPoint: { seconds: 1800, ticks: '1800' },
//             start: { seconds: 0, ticks: '0' },
//             end: { seconds: 1800, ticks: '1800' },
//             mediaType: 'video',
//             type: 1,
//             disabled: false,
//             isSpeedReversed: 0,
//             getSpeed: 1
//           });
//         }
//       }
//
//       const data = { selection: mockTrackItems };
//       logApiCall('activeSequenceSelectionChanged', 'event', data);
//       callback(data);
//     }, 20000);
//
//     return () => {
//       if (mockSelectionInterval) {
//         clearInterval(mockSelectionInterval);
//         logApiCall('activeSequenceSelectionChanged', 'unsubscribe');
//       }
//     };
//   }
//
//   logApiCall(`listenTS:${event}`, 'end');
//   return () => {};
// };