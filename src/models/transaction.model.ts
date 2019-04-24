/**
 * recipient:	25 bytes (binary)	The address of the recipient account.
 * messageSize:	uint16	            The size of the attached message.
 * mosaicsCount:	uint8	            The number of attached mosaics.
 * message:	    array(byte, messageSize)	The message type (0) and a payload of up to 1023 bytes.
 * mosaics:	    array(UnresolvedMosaic, mosaicsCount)	The different mosaic to be sent.
 */
export interface Transaction{
    recipient: string,
    messageSize: number,
    mosaicCount: number,
    message: string,
}