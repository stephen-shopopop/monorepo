import diagnostics_channel from 'node:diagnostics_channel'

const APP_DIAGNOSTICS = 'app-diagnostics'

export const diagnosticsChannel = diagnostics_channel.channel(APP_DIAGNOSTICS)
