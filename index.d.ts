
// Type definitions for bittorrent-dht 9.0
// Project: https://github.com/webtorrent/bittorrent-dht
// Definitions by: zcorw <https://github.com/zcorw>

/// <reference types="node" />

declare module 'bittorrent-dht' {
  import { EventEmitter } from 'events';
  type abort = () => void;
  type query = (err: Error, key: hash, n: number) => void;
  type hash = Buffer | ArrayBuffer | string;
  type strOrBuf = string | Buffer;

  interface dhtOpt {
    nodeId?: strOrBuf,      // 160-bit DHT node ID (Buffer or hex string, default: randomly generated)
    bootstrap?: string[],   // bootstrap servers (default: router.bittorrent.com:6881, router.utorrent.com:6881, dht.transmissionbt.com:6881)
    host?: false | string,     // host of local peer, if specified then announces get added to local table (String, disabled by default)
    concurrency?: number, // k-rpc option to specify maximum concurrent UDP requests allowed (Number, 16 by default)
    hash?(): hash,  // custom hash function to use (Function, SHA1 by default),
    krpc?(): any,     // optional k-rpc instance
    timeBucketOutdated?: number, // check buckets every 15min
    maxAge?: number,  // optional setting for announced peers to time out
    verify?(signature: strOrBuf, message: strOrBuf, publicKey: strOrBuf): boolean,
  }

  interface socketAddress {
    address: string,
    family: string,
    port: number,
  }

  interface immutableMessage {
    id?: strOrBuf,
    v: strOrBuf,
  }

  interface mutableMessage extends immutableMessage {
    k: Buffer,
    sig: Buffer | ((msg: Buffer) => Buffer),
    seq: number,
    salt?: Buffer,
    cas?: number,
  }

  interface messages {
    [key: string]: {
      v: string,
      id: string,
      seq: number,
      sig: string,
      k: string,
    }
  }

  type nodeAddress = {
    id?: hash,
    address: string,
    port: number,
  };

  type peerAddress = {
    id?: hash,
    host: string,
    port: number,
  }

  interface getOpt {
    verify?: (signature: strOrBuf, message: strOrBuf, publicKey: strOrBuf) => boolean,
    salt?: strOrBuf,
    cache?: Buffer,
  }

  class Client extends EventEmitter {
    constructor(opt?: dhtOpt);

    lookup(infohash: hash, callback?: query): abort;

    listen(port?: number, address?: string, onlistening?: () => void): void;
    listen(port?: number, onlistening?: () => void): void;

    address(): socketAddress;

    announce(infoHash: hash, port?: number, callback?: query): void;

    toJSON(): { nodes: nodeAddress[], values: messages };

    addNode(node: nodeAddress): void;

    removeNode(id: hash): void;

    destroy(callback: () => {}): void;

    put(opts: Buffer | string | immutableMessage | mutableMessage, callback: query): hash;

    get(key: hash, opts: getOpt, callback: (err: Error, value: immutableMessage | mutableMessage) => void): void;
    get(key: hash, callback: (err: Error, value: immutableMessage | mutableMessage) => void): void;

    on(events: 'ready' | 'listening', callback: () => void): this;
    on(event: 'peer', callback: (
      peer: peerAddress,
      infoHash: Buffer,
      from: nodeAddress
    ) => void): this;
    on(event: 'error', callback: (err: Error) => void): this;
    on(event: 'node', callback: (node: peerAddress) => void): this;
    on(event: 'announce', callback: (peer: peerAddress, infoHash: hash) => void): this;
    on(event: 'warning', callback: (err: Error) => void): this;
  }
  export = Client;
}