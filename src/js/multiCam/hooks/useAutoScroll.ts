import { useEffect, useRef } from 'react';
import {TrackItemVO} from "../../../shared/vo";

export const useAutoScroll = (selectedTrackItems: TrackItemVO[]) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrolledNodeId = useRef<string | null>(null);

  useEffect(() => {
    // Only scroll when there's exactly one item selected
    if (selectedTrackItems.length !== 1) {
      lastScrolledNodeId.current = null;
      return;
    }

    const selectedItem = selectedTrackItems[0];

    // Prevent scrolling to the same item multiple times
    if (lastScrolledNodeId.current === selectedItem.nodeId) {
      return;
    }

    // Find the element with the matching nodeId
    const element = document.querySelector(`[data-node-id="${selectedItem.nodeId}"]`);
    if (!element) return;

    // Calculate the scroll position to center the element in the viewport
    const elementRect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const scrollTop = window.scrollY + (
        elementRect.top -
        (viewportHeight / 2) +
        (elementRect.height / 2)
    );

    // Smooth scroll to the target position
    window.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    });

    lastScrolledNodeId.current = selectedItem.nodeId;
  }, [selectedTrackItems]);

  return containerRef;
};