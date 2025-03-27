export const MOCK_DELAY = 1000;
export const LAST_NODE_ID_KEY = 'premiere-sync-last-node-id';

export const generateUniqueNodeId = () => {
  // Get the last used ID from localStorage
  const lastId = parseInt(localStorage.getItem(LAST_NODE_ID_KEY) || '0', 10);
  
  // Increment the ID
  const newId = lastId + 1;
  
  // Save the new ID back to localStorage
  localStorage.setItem(LAST_NODE_ID_KEY, newId.toString());
  
  // Generate the node ID with padded number
  return `track_${String(newId).padStart(3, '0')}`;
};

type ApiType = 'REQUEST' | 'SUBSCRIPTION' | 'EVENT';

interface LogContext {
  startTime: number;
  type: ApiType;
}

const activeApiCalls = new Map<string, LogContext>();

const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

const styles = {
  bold: 'font-weight: bold',
  normal: 'font-weight: normal',
  api: 'color: #4CAF50',
  sub: 'color: #2196F3',
  event: 'color: #FF9800'
};

export const logApiCall = (name: string, type: 'start' | 'end' | 'event' | 'unsubscribe', data?: any) => {
  const timestamp = new Date().toISOString();
  const apiType: ApiType = type === 'event' ? 'EVENT' : 
                          type === 'unsubscribe' ? 'SUBSCRIPTION' :
                          name.startsWith('listenTS') ? 'SUBSCRIPTION' : 
                          'REQUEST';
  
  const prefix = apiType === 'EVENT' ? '[EVENT]' :
                apiType === 'SUBSCRIPTION' ? '[SUB]' :
                '[API]';
  
  const prefixStyle = apiType === 'EVENT' ? styles.event :
                     apiType === 'SUBSCRIPTION' ? styles.sub :
                     styles.api;

  if (type === 'start') {
    activeApiCalls.set(name, {
      startTime: performance.now(),
      type: apiType
    });
    console.log(
      `%c${prefix}%c ${timestamp} - Started %c${name}%c`,
      prefixStyle,
      styles.normal,
      styles.bold,
      styles.normal
    );
    if (data) {
      console.log(`${prefix} Request:`, data);
    }
  } 
  else if (type === 'end') {
    const context = activeApiCalls.get(name);
    if (context) {
      const duration = performance.now() - context.startTime;
      console.log(
        `%c${prefix}%c ${timestamp} - Completed %c${name}%c (${formatDuration(duration)})`,
        prefixStyle,
        styles.normal,
        styles.bold,
        styles.normal
      );
      if (data) {
        console.log(`${prefix} Response:`, data);
      }
      activeApiCalls.delete(name);
    }
  }
  else if (type === 'event') {
    console.log(
      `%c${prefix}%c ${timestamp} - %c${name}%c event received`,
      prefixStyle,
      styles.normal,
      styles.bold,
      styles.normal
    );
    if (data) {
      console.log(`${prefix} Event data:`, data);
    }
  }
  else if (type === 'unsubscribe') {
    console.log(
      `%c${prefix}%c ${timestamp} - Unsubscribed from %c${name}%c`,
      prefixStyle,
      styles.normal,
      styles.bold,
      styles.normal
    );
  }
};