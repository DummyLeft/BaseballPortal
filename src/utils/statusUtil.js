import { ts2Date } from './timeUtil';

const INGESTION_RUN_RUNNING = 1;
const INGESTION_RUN_FAILED = 2;
const INGESTION_RUN_SUCCESS = 3;

export const getIngestionRunStatus = (status_id) => {
	switch(status_id) {
		case INGESTION_RUN_SUCCESS:
			return 'success';
		case INGESTION_RUN_FAILED:
			return 'failed';
		case INGESTION_RUN_RUNNING:
			return 'running';
	}
}

export const parseSerial = (value) => {
	if (value.startsWith("A")) {
		return ts2Date(value.substr(1));
	} else if (value.startsWith("B")) {
		return value.substr(1).split(",")[0];
	} else {
		return value;
	}
}